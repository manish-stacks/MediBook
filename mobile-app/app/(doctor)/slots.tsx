// app/(doctor)/slots.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { slotsApi } from '../../src/api/endpoints';
import { Colors, FontSize, Radius, Shadow } from '../../src/constants/theme';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
const DAY_SHORT: Record<string, string> = { MONDAY:'Mon', TUESDAY:'Tue', WEDNESDAY:'Wed', THURSDAY:'Thu', FRIDAY:'Fri', SATURDAY:'Sat', SUNDAY:'Sun' };
const DURATIONS = [15, 20, 30, 45, 60];

export default function DoctorSlotsScreen() {
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '13:00', slotDuration: 30 });

  const { data: slotsData, isLoading } = useQuery({ queryKey: ['my-slots'], queryFn: () => slotsApi.getMySlots().then(r => r.data.data) });

  const createMutation = useMutation({
    mutationFn: (data: any) => slotsApi.create(data),
    onSuccess: () => { Toast.show({ type: 'success', text1: 'Slot created! ✅' }); qc.invalidateQueries({ queryKey: ['my-slots'] }); setShowForm(false); },
    onError: (e: any) => Toast.show({ type: 'error', text1: e.response?.data?.message || 'Failed' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => slotsApi.delete(id),
    onSuccess: () => { Toast.show({ type: 'success', text1: 'Slot removed' }); qc.invalidateQueries({ queryKey: ['my-slots'] }); },
  });

  const slots = slotsData || [];
  const slotsByDay = DAYS.reduce((acc, day) => ({ ...acc, [day]: slots.filter((s: any) => s.day === day) }), {} as Record<string, any[]>);

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Slot', 'Remove this time slot?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };



  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Manage Slots</Text>
          <Text style={styles.headerSub}>Configure your weekly availability</Text>
        </View>
        <TouchableOpacity onPress={() => setShowForm(!showForm)} style={[styles.addBtn, showForm && styles.addBtnActive]}>
          <Ionicons name={showForm ? 'close' : 'add'} size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Create form */}
      {showForm && (
        <Card style={styles.formCard} elevated>
          <Text style={styles.formTitle}>Add New Time Slot</Text>

          {/* Day selector */}
          <View style={styles.dayGrid}>
            {DAYS.map(day => (
              <TouchableOpacity key={day} onPress={() => setForm(f => ({ ...f, dayOfWeek: day }))}
                style={[styles.dayBtn, form.dayOfWeek === day && styles.dayBtnActive]}>
                <Text style={[styles.dayBtnText, form.dayOfWeek === day && styles.dayBtnTextActive]}>{DAY_SHORT[day]}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Time inputs */}
          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Text style={styles.fieldLabel}>Start Time</Text>
              <TouchableOpacity style={styles.timeInput}>
                <Ionicons name="time-outline" size={16} color={Colors.teal[600]} />
                <Text style={[styles.timeInputText, { color: Colors.slate[900] }]}>{form.startTime}</Text>
              </TouchableOpacity>
            </View>
            <Ionicons name="arrow-forward" size={16} color={Colors.slate[300]} style={{ marginTop: 28 }} />
            <View style={styles.timeField}>
              <Text style={styles.fieldLabel}>End Time</Text>
              <TouchableOpacity style={styles.timeInput}>
                <Ionicons name="time-outline" size={16} color={Colors.teal[600]} />
                <Text style={[styles.timeInputText, { color: Colors.slate[900] }]}>{form.endTime}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Time presets */}
          <View>
            <Text style={styles.fieldLabel}>Quick Set Start</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
              {['09:00','10:00','11:00','14:00','15:00','16:00','17:00'].map(t => (
                <TouchableOpacity key={t} onPress={() => setForm(f => ({ ...f, startTime: t }))} style={[styles.presetBtn, form.startTime === t && styles.presetBtnActive]}>
                  <Text style={[styles.presetText, form.startTime === t && styles.presetTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={[styles.fieldLabel, { marginTop: 8 }]}>Quick Set End</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
              {['12:00','13:00','14:00','17:00','18:00','19:00','20:00'].map(t => (
                <TouchableOpacity key={t} onPress={() => setForm(f => ({ ...f, endTime: t }))} style={[styles.presetBtn, form.endTime === t && styles.presetBtnActive]}>
                  <Text style={[styles.presetText, form.endTime === t && styles.presetTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Duration */}
          <View>
            <Text style={styles.fieldLabel}>Slot Duration (minutes)</Text>
            <View style={styles.durRow}>
              {DURATIONS.map(d => (
                <TouchableOpacity key={d} onPress={() => setForm(f => ({ ...f, slotDuration: d }))} style={[styles.durBtn, form.slotDuration === d && styles.durBtnActive]}>
                  <Text style={[styles.durText, form.slotDuration === d && styles.durTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button title="Create Slot" onPress={() => createMutation.mutate(form)} loading={createMutation.isPending} gradient={['#02c9b3', '#1e6fe8']} fullWidth size="md" />
        </Card>
      )}

      {/* Slots by day */}
      {isLoading ? <LoadingSpinner /> : (
        <View style={styles.slotList}>
          {DAYS.map(day => {
            const daySlots = slotsByDay[day] || [];
            if (daySlots.length === 0) return null;
            return (
              <View key={day} style={styles.dayGroup}>
                <Text style={styles.dayHeader}>{day.charAt(0) + day.slice(1).toLowerCase()}</Text>
                {daySlots.map((slot: any) => (
                  <View key={slot.id} style={styles.slotRow}>
                    <Ionicons name="time-outline" size={16} color={Colors.teal[600]} />
                    <Text style={styles.slotTime}>{slot.startTime} → {slot.endTime}</Text>
                    <Text style={styles.slotDuration}>{slot.duration}min slots</Text>
                    <TouchableOpacity onPress={() => confirmDelete(slot.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={16} color={Colors.red[500]} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            );
          })}
          {slots.length === 0 && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>⏰</Text>
              <Text style={styles.emptyTitle}>No slots configured</Text>
              <Text style={styles.emptySub}>Tap + to add your first time slot</Text>
            </View>
          )}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// Simple text input workaround
function TextInputBasic({ value, onChangeText, placeholder, style }: any) {
  const { TextInput } = require('react-native');
  return <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} style={style} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.slate[50] },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.slate[100] },
  headerTitle: { fontSize: FontSize['3xl'], fontWeight: '900', color: Colors.slate[900] },
  headerSub: { fontSize: FontSize.sm, color: Colors.slate[500], marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.teal[600], alignItems: 'center', justifyContent: 'center' },
  addBtnActive: { backgroundColor: Colors.slate[700] },

  formCard: { margin: 14, gap: 14 },
  formTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.slate[900], marginBottom: 4 },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.slate[100] },
  dayBtnActive: { backgroundColor: Colors.teal[600] },
  dayBtnText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.slate[600] },
  dayBtnTextActive: { color: Colors.white },
  timeRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  timeField: { flex: 1 },
  fieldLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.slate[500], marginBottom: 6 },
  timeInput: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.slate[50], borderRadius: Radius.lg, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1.5, borderColor: Colors.slate[200] },
  timeText: { flex: 1, fontSize: FontSize.base, color: Colors.slate[900] },
  timeInputText: { fontSize: FontSize.base, fontWeight: '600' },
  presetBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.slate[100] },
  presetBtnActive: { backgroundColor: Colors.teal[400], borderWidth: 1.5, borderColor: Colors.teal[500] },
  presetText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.slate[600] },
  presetTextActive: { color: Colors.teal[600] },
  durRow: { flexDirection: 'row', gap: 8 },
  durBtn: { flex: 1, paddingVertical: 10, borderRadius: Radius.lg, backgroundColor: Colors.slate[100], alignItems: 'center' },
  durBtnActive: { backgroundColor: Colors.teal[400] },
  durText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.slate[600] },
  durTextActive: { color: Colors.white },

  slotList: { padding: 14, gap: 12 },
  dayGroup: { gap: 6 },
  dayHeader: { fontSize: FontSize.base, fontWeight: '800', color: Colors.slate[700], marginBottom: 4 },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 14, borderWidth: 1, borderColor: Colors.slate[100], ...Shadow.sm },
  slotTime: { flex: 1, fontSize: FontSize.base, fontWeight: '700', color: Colors.slate[900] },
  slotDuration: { fontSize: FontSize.xs, color: Colors.teal[600], fontWeight: '600' },
  deleteBtn: { padding: 4 },

  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.slate[800], marginBottom: 6 },
  emptySub: { fontSize: FontSize.sm, color: Colors.slate[400] },
});
